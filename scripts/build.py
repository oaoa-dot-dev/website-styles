#!/usr/bin/env python3
"""
OAOA Style Framework - Build & Packaging Script
Minifies CSS/JS assets, copies files to dist/, and generates
high-efficiency pre-compressed .gz (gzip) and .br (brotli) bundles.
"""

import os
import re
import gzip
import shutil
import ctypes
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
DIST_DIR = ROOT_DIR / "dist"
V1_DIR = DIST_DIR / "v1"

def get_brotli_compressor():
    try:
        lib = ctypes.CDLL("/usr/lib/x86_64-linux-gnu/libbrotlienc.so.1")
        lib.BrotliEncoderMaxCompressedSize.argtypes = [ctypes.c_size_t]
        lib.BrotliEncoderMaxCompressedSize.restype = ctypes.c_size_t
        lib.BrotliEncoderCompress.argtypes = [
            ctypes.c_int, ctypes.c_int, ctypes.c_int,
            ctypes.c_size_t, ctypes.c_char_p,
            ctypes.POINTER(ctypes.c_size_t), ctypes.c_char_p
        ]
        lib.BrotliEncoderCompress.restype = ctypes.c_int

        def compress_br(data: bytes, quality=11) -> bytes:
            max_size = lib.BrotliEncoderMaxCompressedSize(len(data))
            out_buf = ctypes.create_string_buffer(max_size)
            out_size = ctypes.c_size_t(max_size)
            res = lib.BrotliEncoderCompress(
                quality, 22, 0, len(data), data, ctypes.byref(out_size), out_buf
            )
            if res != 1:
                raise RuntimeError("Brotli compression failed")
            return out_buf.raw[:out_size.value]

        return compress_br
    except Exception as e:
        print(f"[WARN] Brotli encoder library not loaded: {e}")
        return None

def minify_css(css_content: str) -> str:
    """Minify CSS by stripping comments and unnecessary whitespace."""
    license_match = re.match(r'/\*![\s\S]*?\*/|/\*\*[\s\S]*?Version:[\s\S]*?\*/', css_content)
    header = license_match.group(0).strip() + "\n" if license_match else ""

    # Remove comments
    content = re.sub(r'/\*[\s\S]*?\*/', '', css_content)
    # Collapse multiple whitespaces
    content = re.sub(r'\s+', ' ', content)
    # Remove space around delimiters
    content = re.sub(r'\s*([\{\}\:\;\,\>])\s*', r'\1', content)
    # Remove last semicolon in rules
    content = re.sub(r';\}', '}', content)
    return (header + content).strip()

def minify_js(js_content: str) -> str:
    """Minify JS safely preserving strings."""
    # Remove multi-line comments
    content = re.sub(r'/\*[\s\S]*?\*/', '', js_content)
    # Remove single line comments
    lines = []
    for line in content.splitlines():
        stripped = line.strip()
        if stripped.startswith('//'):
            continue
        lines.append(line)
    content = "\n".join(lines)
    # Collapse multiple blank lines
    content = re.sub(r'\n\s*\n', '\n', content)
    return content.strip()

def compress_gzip(data: bytes) -> bytes:
    return gzip.compress(data, compresslevel=9)

def main():
    print("=" * 60)
    print("OAOA Style Framework - Build & Dist Generator")
    print("=" * 60)

    DIST_DIR.mkdir(parents=True, exist_ok=True)
    V1_DIR.mkdir(parents=True, exist_ok=True)
    brotli_fn = get_brotli_compressor()

    css_path = ROOT_DIR / "framework.css"
    js_path = ROOT_DIR / "framework.js"
    html_path = ROOT_DIR / "index.html"
    headers_path = ROOT_DIR / "_headers"

    css_raw = css_path.read_text(encoding="utf-8")
    js_raw = js_path.read_text(encoding="utf-8")
    html_raw = html_path.read_text(encoding="utf-8")

    css_min = minify_css(css_raw)
    js_min = minify_js(js_raw)

    artifacts = {
        "framework.css": css_raw.encode("utf-8"),
        "framework.min.css": css_min.encode("utf-8"),
        "framework.js": js_raw.encode("utf-8"),
        "framework.min.js": js_min.encode("utf-8"),
        "index.html": html_raw.encode("utf-8"),
    }

    print("\n[Writing Distribution Files]")
    for name, data in artifacts.items():
        out_file = DIST_DIR / name
        out_file.write_bytes(data)
        print(f"  ✓ {name:<20} {len(data):>7,} bytes")

        # Gzip
        gz_data = compress_gzip(data)
        (DIST_DIR / f"{name}.gz").write_bytes(gz_data)
        gz_ratio = (1.0 - len(gz_data) / max(len(data), 1)) * 100
        print(f"    ↳ {name + '.gz':<18} {len(gz_data):>7,} bytes (-{gz_ratio:.1f}%)")

        # Brotli
        if brotli_fn:
            br_data = brotli_fn(data)
            (DIST_DIR / f"{name}.br").write_bytes(br_data)
            br_ratio = (1.0 - len(br_data) / max(len(data), 1)) * 100
            print(f"    ↳ {name + '.br':<18} {len(br_data):>7,} bytes (-{br_ratio:.1f}%)")

    # Copy files to v1/ directory for pinned versioning
    print("\n[Creating v1/ Pinned Version Distribution]")
    for item in ["framework.css", "framework.min.css", "framework.js", "framework.min.js"]:
        for suffix in ["", ".gz", ".br"]:
            filename = f"{item}{suffix}"
            src = DIST_DIR / filename
            if src.exists():
                shutil.copy2(src, V1_DIR / filename)
    print(f"  ✓ v1 assets mirrored in {V1_DIR}")

    # Copy Cloudflare Pages _headers
    if headers_path.exists():
        shutil.copy2(headers_path, DIST_DIR / "_headers")
        print(f"  ✓ Cloudflare _headers copied to dist/_headers")

    print("\nBuild complete. All dist files ready in:")
    print(f"  {DIST_DIR}\n")

if __name__ == "__main__":
    main()
