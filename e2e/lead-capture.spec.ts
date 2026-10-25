import { test, expect } from "@playwright/test";

test.describe("Lead capture form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/cars");
    await page.waitForLoadState("networkidle");
  });

  test("should submit lead form successfully", async ({ page }) => {
    const carCards = page.locator('[data-testid="car-card"]').first();
    await expect(carCards).toBeVisible({ timeout: 10000 });

    await carCards.click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/cars\/.*/);

    await page.locator("#name").fill("John Doe");
    await page.locator("#phone").fill("0712345678");
    await page.locator("#email").fill("john@example.com");
    await page.locator("#message").fill("I am interested in this vehicle.");

    await page.locator('button:has-text("Reserve vehicle"), button:has-text("Enquire")').first().click();

    await expect(page.locator('text=Thank you, text=success, text=submitted')).toBeVisible({ timeout: 10000 });
  });

  test("should show validation errors for empty required fields", async ({ page }) => {
    const carCards = page.locator('[data-testid="car-card"]').first();
    await expect(carCards).toBeVisible({ timeout: 10000 });
    await carCards.click();
    await page.waitForLoadState("networkidle");

    await page.locator('button:has-text("Reserve vehicle"), button:has-text("Enquire")').first().click();

    await expect(page.locator('text=required, text=Required, text=invalid')).toBeVisible({ timeout: 5000 });
  });

  test("should submit trade-in form", async ({ page }) => {
    await page.goto("/trade-in");
    await page.waitForLoadState("networkidle");

    await page.locator("#make").fill("Toyota");
    await page.locator("#model").fill("Corolla");
    await page.locator("#year").fill("2018");
    await page.locator("#mileage").fill("85000");
    await page.locator("#phone").fill("0712345678");
    await page.locator("#condition_notes").fill("Good condition, regular service history.");

    await page.locator('button:has-text("Get valuation"), button:has-text("Submit")').click();

    await expect(page.locator('text=Thank you, text=success, text=submitted, text=received')).toBeVisible({ timeout: 10000 });
  });
});