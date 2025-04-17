# TASK 1: Implement JustEnglish Syntax Highlighting with JustCreate Branding

## 📦 All Assets Are Ready in Your Repo

**Directory:** `justcreate-vscode-theme/`

- **Theme JSONs:**  
  - `themes/justcreate-dark-color-theme.json`
  - `themes/justcreate-light-color-theme.json`
- **Sample JustEnglish File:**  
  - `sample/hello.justenglish`
- **Logos:**  
  - `icons/justcreate-logo.svg` (concise, 3-letter)
  - `icons/justcreate-full-logo.svg` (full wordmark)
- **Font:**  
  - Montserrat (referenced via Google Fonts in mockups; document in README if needed)
- **Color Palette:**  
  - Encoded in theme files and README

---

## 📝 Step-by-Step Instructions

### 1. **Review the Brand Color Mapping**
- **Keywords:** Blue `#4285F4`
- **Types/Classes:** Green `#34A853`
- **Strings:** Yellow `#FBBC05`
- **Numbers:** Orange `#FF9800`
- **Functions:** Purple `#8E24AA`
- **Variables:** Red `#EA4335`
- **Comments:** Gray `#b0b4b9`
- **Backgrounds:**  
  - Dark: `#202124`  
  - Light: `#f8f9fa`
- **Text:**  
  - Dark: `#f8f9fa`  
  - Light: `#202124`

### 2. **Open the Theme Files**
- Go to `themes/justcreate-dark-color-theme.json` and `themes/justcreate-light-color-theme.json`.
- Review the `"tokenColors"` array.  
  It already includes mappings for JustEnglish language scopes (e.g., `keyword.control.justenglish`, `string.quoted.justenglish`, etc.) using the brand palette.

### 3. **Test with JustEnglish Code**
- Open `sample/hello.justenglish` in VSCode.
- Enable the JustCreate theme (dark and light) in VSCode.
- Confirm that:
  - Keywords, strings, numbers, functions, variables, and comments all use the correct colors.
  - The code is readable and visually matches the JustCreate look.

### 4. **Expand or Adjust as Needed**
- If JustEnglish defines additional syntax scopes, add them to the `"tokenColors"` array in both theme files.
- If any colors need tweaking for contrast or clarity, adjust the hex values in the theme files.

### 5. **Accessibility Check**
- Make sure all code elements are readable in both light and dark modes.
- Use online contrast checkers if needed.

### 6. **Polish and Document**
- Add screenshots of before/after to the README for clarity.
- Document the color mapping and how to contribute new scopes or colors.

### 7. **Publish**
- Test the theme in the VSCode Extension Development Host (`F5` in VSCode).
- When ready, package and publish to the VSCode Marketplace.

---

## 🗂️ Your Repo Structure (for reference)

```
justcreate-vscode-theme/
├── themes/
│   ├── justcreate-dark-color-theme.json
│   └── justcreate-light-color-theme.json
├── sample/
│   └── hello.justenglish
├── icons/
│   ├── justcreate-logo.svg
│   └── justcreate-full-logo.svg
├── README.md
├── package.json
```

---

**All assets and starter configs are present.**
Follow the steps above to deliver a beautiful, branded JustEnglish coding experience in VSCode.

If you need more sample files, want to automate testing, or want more branding polish, just ask!

---

# TASK 2: Make VSCode Ultra-Rounded and Fully JustCreate-Branded (FORK)

## 🎯 Objective
Transform the VSCode base (custom fork) to match the soft, ultra-rounded, and modern JustCreate look as shown in `mock_vscode.html`.

## 📝 Step-by-Step Instructions

### 1. **Locate and Prepare the UI Source**
- Work in your VSCode fork (not just a theme extension).
- Most UI styles are in `/src/vs/workbench` and `/src/vs/base/browser/ui`.
- Set up a dedicated `branding` or `justcreate` branch.

### 2. **Implement Ultra-Rounded UI**
- Edit CSS/LESS for all major UI elements:
  - **Tabs:** `border-radius: 12px 12px 0 0 !important;`
  - **Panels, Popups, Sidebars:** `border-radius: 18px !important;`
  - **Buttons:** `border-radius: 24px !important;`
  - **Inputs, Dropdowns:** `border-radius: 12px !important;`
- Make sure all corners are visually soft and consistent with the mockup.

### 3. **Apply JustCreate Colors and Font**
- Use the color palette from your theme and `mock_vscode.html`:
  - **Blue:** #4285F4
  - **Green:** #34A853
  - **Yellow:** #FBBC05
  - **Red:** #EA4335
  - **Orange:** #FF9800
  - **Purple:** #8E24AA
  - **Slate Black:** #202124
  - **Light BG:** #f8f9fa
- Set the global font to `Montserrat, Arial, sans-serif` everywhere in the UI.
- Adjust spacing, drop shadows, and padding for a soft, modern feel.

### 4. **Integrate Logos and Icons**
- Replace activity bar and sidebar icons with your SVG logos (`icons/justcreate-logo.svg`, `icons/justcreate-full-logo.svg`).
- Use the 3-letter logo format (e.g., JCe) for concise branding.

### 5. **Test and Iterate**
- Build and run your fork locally on all platforms.
- Compare the look to `mock_vscode.html` for fidelity.
- Refine roundness, colors, and font usage as needed.

### 6. **Document Your Changes**
- Clearly comment and document all style and UI changes for future maintainability.
- Add screenshots and before/after comparisons to the README.

### 7. **Maintain Upstream Compatibility**
- Keep branding changes modular for easier merging with future VSCode updates.

## 🗂️ Reference Assets
- `mock_vscode.html` — Use as your visual template.
- `icons/justcreate-logo.svg`, `icons/justcreate-full-logo.svg` — For branding.
- Theme JSONs — For color palette reference.

---

**This is a high-priority, flagship branding task!**
Deliver a truly custom, ultra-rounded, and visually stunning JustCreate IDE experience.
