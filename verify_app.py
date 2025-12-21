import os
from playwright.sync_api import sync_playwright

def verify():
    print("Starting verification...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # Load the file
        url = f"file://{os.path.abspath('index.html')}"
        print(f"Loading {url}")
        page.goto(url)
        
        # Wait for loading to finish
        try:
            page.wait_for_selector("#loading-overlay", state="hidden", timeout=5000)
            print("Loading overlay hidden.")
        except:
            print("Warning: Loading overlay did not hide.")

        # Take main screenshot
        page.screenshot(path="verification/verification.png")
        print("Saved verification/verification.png")
        
        # Also take a dark mode one for robustness, though only one is needed for the tool
        page.click("#theme-toggle")
        page.wait_for_timeout(500)
        page.screenshot(path="verification/verification_dark.png")
        print("Saved verification/verification_dark.png")

        browser.close()

if __name__ == "__main__":
    verify()
