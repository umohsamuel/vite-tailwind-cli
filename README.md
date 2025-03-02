# create-vite-tailwind-app

A CLI tool to scaffold a new **Vite + Tailwind CSS** project in seconds.

## Features

- **Interactive prompts** to name your project and optionally install Tailwind CSS.
- **Vite project creation** using your preferred package manager (npm, yarn, pnpm, or bun).
- **Tailwind CSS setup**: automatically adds `tailwindcss` and `@tailwindcss/vite`, plus basic configuration in your CSS and `vite.config.ts`.
- **Flexible directory choice**: create a new folder or use the current directory.

---

## Installation

You can simply use `npx` each time, or use other equivalents like `pnpm dlx` depending on your package manager.

### Using `npx` (no global install)

```bash
npx create-vite-tailwind-app
```

## Usage

# 1. Create a New Project in a Subfolder

```bash
npx create-vite-tailwind-app my-app
```

Prompts for installing Tailwind.

If `yes`, Tailwind is installed and configured.
Installs dependencies and leaves you ready to cd my-app && npm run dev.

# 2. Create a New Project in the Current Directory

```bash
npx create-vite-tailwind-app .
```

Prompts whether you really want to use the current directory.
If `no`, it will ask for a different folder name.
If `yes`, scaffolds everything in the current folder.

# 3. Installing Tailwind (Optional)

During setup, the CLI asks:

Would you like to install Tailwind?
If you say `yes`, it automatically:

Installs tailwindcss and @tailwindcss/vite.
Creates/updates vite.config.ts to enable Tailwind.
Adds Tailwind directives (@tailwind base; @tailwind components; @tailwind utilities;) to your existing CSS.

# 4. Development

Once the project is created (and dependencies are installed), navigate into your new project folder (if it’s not the current directory) and run:

```bash
npm run dev
```

(Or use yarn dev, pnpm dev, etc. depending on your package manager.)

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or pull request on GitHub https://github.com/umohsamuel/vite-tailwind-cli.

## License

This project is licensed under the MIT License.
© 2025 Umoh Samuel.
