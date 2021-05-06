import { Selector } from "testcafe";
import testcafeconfig from "../testcafeconfig";
import Page from "../page-model";

fixture`Test settings`.page`${testcafeconfig.url}`;

const page = new Page();

test.meta("testID", "settings-general-001")("General Settings", async (t) => {
  await t.expect(Selector(".action-upload").exists, { timeout: 5000 }).ok();
  await page.openNav();
  await t
    .expect(Selector(".nav-browse").innerText)
    .contains("Search")
    .click(Selector(".nav-browse"));
  await page.setFilter("view", "Cards");
  await page.search("photo:true");
  await page.toggleSelectNthPhoto(0);
  await t
    .click(Selector("button.action-menu"))
    .expect(Selector("button.action-download").visible)
    .ok()
    .expect(Selector("button.action-share").visible)
    .ok()
    .expect(Selector("button.action-edit").visible)
    .ok()
    .expect(Selector("button.action-private").visible)
    .ok();
  await page.clearSelection();
  await t.click(Selector("div.is-photo").nth(0));
  await t
    .expect(Selector("#photo-viewer").visible)
    .ok()
    .expect(Selector(".action-download").exists)
    .ok()
    .click(Selector(".action-close"));
  if (t.browser.os.name !== "macOS") {
    if (await Selector(".action-close").exists) {
      await t.click(Selector(".action-close"));
    }
  }
  await t
    .expect(Selector("button.action-location").visible)
    .ok()
    .click(Selector("button.action-title-edit").nth(0))
    .expect(Selector(".input-title input", { timeout: 8000 }).hasAttribute("disabled"))
    .notOk()
    .click(Selector("#tab-labels"))
    .expect(Selector("button.p-photo-label-add").visible)
    .ok()
    .click(Selector("#tab-details"))
    .click(Selector("button.action-close"));
  await page.openNav();
  await t
    .click(Selector(".nav-library"))
    .expect(Selector("#tab-library-import a").visible)
    .ok()
    .expect(Selector("#tab-library-logs a").visible)
    .ok();
  await page.openNav();
  await t.click(Selector("div.nav-browse + div")).click(Selector(".nav-archive"));
  await page.toggleSelectNthPhoto(0);
  await t
    .click(Selector("button.action-menu"))
    .expect(Selector("button.action-delete").exists)
    .ok();
  await page.clearSelection();
  await page.openNav();
  await t
    .expect(Selector(".nav-archive").visible)
    .ok()
    .expect(Selector(".nav-review").visible)
    .ok()
    .click(Selector("div.nav-library + div"))
    .expect(Selector(".nav-originals").visible)
    .ok()
    .click(Selector("div.nav-albums + div"))
    .expect(Selector(".nav-folders").visible)
    .ok()
    .expect(Selector(".nav-moments").visible)
    .ok()
    .expect(Selector(".nav-labels").visible)
    .ok()
    .expect(Selector(".nav-places").visible)
    .ok()
    .expect(Selector(".nav-private").visible)
    .ok()
    .click(Selector(".nav-settings"))
    .click(Selector(".input-language input"))
    .hover(Selector("div").withText("Deutsch").parent('div[role="listitem"]'))
    .click(Selector("div").withText("Deutsch").parent('div[role="listitem"]'))
    .click(Selector(".input-upload input"))
    .click(Selector(".input-download input"))
    .click(Selector(".input-import input"))
    .click(Selector(".input-archive input"))
    .click(Selector(".input-edit input"))
    .click(Selector(".input-files input"))
    .click(Selector(".input-moments input"))
    .click(Selector(".input-labels input"))
    .click(Selector(".input-logs input"))
    .click(Selector(".input-share input"))
    .click(Selector(".input-places input"))
    .click(Selector(".input-delete input"))
    .click(Selector(".input-private input"))
    .click(Selector("#tab-settings-library"))
    .click(Selector(".input-review input"));
  await page.openNav();
  await t.eval(() => location.reload());
  await page.openNav();
  await t.click(Selector(".nav-calendar"));
  await page.checkButtonVisibility("download", false, false);
  await page.openNav();
  await t.click(Selector(".nav-calendar"));
  await page.checkButtonVisibility("share", false, false);
  await page.openNav();
  await t.click(Selector(".nav-calendar"));
  await page.checkButtonVisibility("upload", false, false);
  await page.openNav();
  await t.click(Selector(".nav-folders"));
  await page.checkButtonVisibility("download", false, false);
  await page.openNav();
  await t.click(Selector(".nav-folders"));
  await page.checkButtonVisibility("share", false, false);
  await page.openNav();
  await t.click(Selector(".nav-folders"));
  await page.checkButtonVisibility("upload", false, false);
  await page.openNav();
  await t.click(Selector(".nav-albums"));
  await page.checkButtonVisibility("download", false, false);
  await page.openNav();
  await t.click(Selector(".nav-albums"));
  await page.checkButtonVisibility("share", false, false);
  await page.openNav();
  await t.click(Selector(".nav-albums"));
  await page.checkButtonVisibility("upload", false, false);
  await page.openNav();
  await t
    .click(Selector(".nav-browse"))
    .expect(Selector("button.action-upload").exists)
    .notOk()
    .expect(Selector(".nav-browse").innerText)
    .contains("Suche")
    .click(Selector(".nav-browse"));
  await page.search("photo:true");
  await page.toggleSelectNthPhoto(0);
  await t
    .click(Selector("button.action-menu"))
    .expect(Selector("button.action-download").exists)
    .notOk()
    .expect(Selector("button.action-share").exists)
    .notOk()
    .expect(Selector("button.action-edit").visible)
    .notOk()
    .expect(Selector("button.action-private").exists)
    .notOk();
  await t
    .hover(Selector(".is-photo.type-image").nth(0))
    .click(Selector(".is-photo.type-image .action-fullscreen").nth(0));
  await t
    .expect(Selector("#photo-viewer", { timeout: 5000 }).visible)
    .ok()
    .expect(Selector(".action-download").exists)
    .notOk()
    .click(Selector(".action-close"));
  if (await Selector(".action-close").visible) {
    await t.click(Selector(".action-close"));
  }
  await page.toggleSelectNthPhoto(0);
  await t
    .expect(Selector("button.action-location").exists)
    .notOk()
    .click(Selector("button.action-title-edit").nth(0))
    .expect(Selector(".input-title input").hasAttribute("disabled"))
    .ok()
    .expect(Selector(".input-latitude input").hasAttribute("disabled"))
    .ok()
    .expect(Selector(".input-timezone input").hasAttribute("disabled"))
    .ok()
    .expect(Selector(".input-country input").hasAttribute("disabled"))
    .ok()
    .expect(Selector(".input-description textarea").hasAttribute("disabled"))
    .ok()
    .expect(Selector(".input-keywords textarea").hasAttribute("disabled"))
    .ok()
    .click(Selector("#tab-labels"))
    .expect(Selector("button.p-photo-label-add").exists)
    .notOk()
    .click(Selector("#tab-details"))
    .click(Selector("button.action-close"));
  await page.openNav();
  await t
    .click(Selector(".nav-library"))
    .expect(Selector("#tab-library-import a").exists)
    .notOk()
    .expect(Selector("#tab-library-logs a").exists)
    .notOk();
  await page.openNav();
  await t
    .click(Selector("div.nav-browse + div"))
    .expect(Selector(".nav-archive").visible)
    .notOk()
    .expect(Selector(".nav-review").exists)
    .notOk()
    .click(Selector("div.nav-library + div"))
    .expect(Selector(".nav-originals").visible)
    .notOk()
    .click(Selector("div.nav-albums + div"))
    .expect(Selector(".nav-moments").visible)
    .notOk()
    .expect(Selector(".nav-labels").visible)
    .notOk()
    .expect(Selector(".nav-places").visible)
    .notOk()
    .expect(Selector(".nav-private").visible)
    .notOk()

    .click(Selector(".nav-settings"))
    .click(Selector(".input-language input"))
    .hover(Selector("div").withText("English").parent('div[role="listitem"]'))
    .click(Selector("div").withText("English").parent('div[role="listitem"]'))
    .click(Selector(".input-upload input"))
    .click(Selector(".input-download input"))
    .click(Selector(".input-import input"))
    .click(Selector(".input-archive input"))
    .click(Selector(".input-edit input"))
    .click(Selector(".input-files input"))
    .click(Selector(".input-moments input"))
    .click(Selector(".input-labels input"))
    .click(Selector(".input-logs input"))
    .click(Selector(".input-share input"))
    .click(Selector(".input-places input"))
    .click(Selector(".input-private input"))
    .click(Selector("#tab-settings-library"))
    .click(Selector(".input-review input"));
  await page.openNav();
  await t.click(Selector("div.nav-browse + div")).click(Selector(".nav-archive"));
  await page.toggleSelectNthPhoto(0);
  await t
    .click(Selector("button.action-menu"))
    .expect(Selector("button.action-delete").exists)
    .notOk();
  await page.clearSelection();
  await page.openNav();
  await t.click(Selector(".nav-settings")).click(Selector(".input-delete input"));
});
