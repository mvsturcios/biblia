from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    
    # Check main page
    print("Navigating to file:///app/index.html")
    page.goto("file:///app/index.html")
    page.wait_for_selector("#chapter-title-display")
    page.screenshot(path="/home/jules/verification/main_view.png")
    print("Main view screenshot taken")

    # Open sidebar (using the new button ID)
    page.click("#open-sidebar-btn")
    page.wait_for_selector("#mobile-book-list")
    page.screenshot(path="/home/jules/verification/sidebar_view.png")
    print("Sidebar screenshot taken")

    # Select a book
    page.click("text=Éxodo")
    page.wait_for_timeout(500) # Wait for transition
    page.screenshot(path="/home/jules/verification/exodus_view.png")
    print("Exodus view screenshot taken")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
