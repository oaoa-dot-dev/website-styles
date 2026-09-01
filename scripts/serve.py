#!/usr/bin/env python3
"""
Simple local development and preview server for OAOA Style Framework.
"""
import os
import sys
import http.server
import socketserver
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
HOST = os.environ.get("HOST", "0.0.0.0")
PORT = int(os.environ.get("PORT", 8080))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT_DIR), **kwargs)

    def end_headers(self):
        # Enable CORS for local testing
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

if __name__ == "__main__":
    os.chdir(ROOT_DIR)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer((HOST, PORT), Handler) as httpd:
        print(f"OAOA Style Framework preview server running on {HOST}:{PORT}")
        print(f"  Local URL:   http://localhost:{PORT}")
        print(f"  Network URL: http://0.0.0.0:{PORT}")
        print("Press Ctrl+C to stop.")
        sys.stdout.flush()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
