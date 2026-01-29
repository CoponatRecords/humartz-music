# Humartz Music

[![TypeScript](https://img.shields.io/badge/TypeScript-85.8%25-blue?logo=typescript&logoColor=white&style=flat-square)](#)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white&style=flat-square)](#)
[![Turborepo](https://img.shields.io/badge/Turborepo-Enabled-red?logo=turborepo&logoColor=white&style=flat-square)](#)
[![pnpm](https://img.shields.io/badge/pnpm-Workspace-orange?logo=pnpm&logoColor=white&style=flat-square)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](#license)

**Humartz Music** is a modern, scalable music platform built with **Next.js** in a **Turborepo** monorepo structure.  
It is designed to deliver high-performance, interactive music experiences — from streaming and artist showcases to immersive web-based audio features — with a clean architecture ready for production.

🌐 **Live Demo**: [https://humartz-music-web.vercel.app](https://humartz-music-web.vercel.app)

## ✨ Features

- Modern **Next.js App Router** architecture
- Full **TypeScript** support with strict type safety
- **Turborepo** monorepo for multiple apps + shared packages
- **Tailwind CSS** + **TWBlocks** for beautiful, consistent styling
- **pnpm** workspaces for fast & disk-efficient dependency management
- Optimized for **Vercel** (zero-config deployments)
- Biome-powered linting & formatting
- Shared utilities, components, and configuration across packages

## 🛠 Tech Stack

| Category         | Tools / Libraries                                 |
|------------------|---------------------------------------------------|
| Framework        | Next.js (App Router)                              |
| Language         | TypeScript                                        |
| Monorepo         | Turborepo                                         |
| Package Manager  | pnpm                                              |
| Styling          | Tailwind CSS + TWBlocks                           |
| Formatting/Lint  | Biome                                             |
| Build            | tsup (for packages)                               |
| Deployment       | Vercel                                            |
| License          | MIT                                               |

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** ≥ 8

# Install pnpm if you don't have it yet
npm install -g pnpm


## Installation
# 1. Clone the repository
git clone https://github.com/CoponatRecords/humartz-music.git
cd humartz-music

# 2. Install all dependencies
pnpm install

# 3. Start development server
pnpm dev

Open http://localhost:3000 to see the result.

## Available Commands

pnpm dev      # Run development server
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run Biome linting
pnpm format   # Format code with Biome
pnpm turbo    # Run turbo commands directly (e.g. pnpm turbo run build)

## 📦 Project Structure

humartz-music/
├── apps/                     # Main applications
│   └── web/                  # Primary Next.js music web app
├── packages/                 # Shared packages & libraries
│   ├── ui/                   # Reusable React components (likely)
│   ├── config/               # Shared eslint, tsconfig, biome, etc.
│   └── ...                   # Other shared utilities
├── scripts/                  # Custom scripts
├── studio/                   # Possible CMS / content studio integration
├── turbo/                    # Turborepo generators & config
├── .github/                  # GitHub workflows & actions
├── .vscode/                  # Recommended VS Code settings
├── public/                   # Static assets
├── .autorc                   # Auto commit/release config
├── biome.jsonc               # Biome configuration
├── turbo.json                # Turborepo pipeline
├── pnpm-workspace.yaml       # Workspace definition
├── pnpm-lock.yaml
├── tsconfig.json
├── tsup.config.ts
├── CHANGELOG.md
├── LICENSE                   # MIT License
└── README.md


## 🌍 Deployment

Vercel (Recommended)

Push to GitHub
Go to vercel.com/new
Import your repository
Vercel auto-detects Turborepo → no extra config needed
Add environment variables if required
Deploy 🎉

## 📄 License

This project is licensed under the **Creative Commons Attribution-NonCommercial-NoDerivs 4.0 International (CC BY-NC-ND 4.0)** license.

**Under this license, you are free to:**
- **Share:** Copy and redistribute the material in any medium or format.

**Under the following terms:**
- **Attribution:** You must give appropriate credit to Coponat Records.
- **Non-Commercial:** You may not use the material for commercial purposes.
- **No-Derivatives:** If you remix, transform, or build upon the material, you may not distribute the modified material.

[Click here to read the full license text.](https://creativecommons.org/licenses/by-nc-nd/4.0/)