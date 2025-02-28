"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectRunningPackageManager = detectRunningPackageManager;
function detectRunningPackageManager() {
    var userAgent = process.env.npm_config_user_agent || "";
    if (userAgent.includes("pnpm")) {
        return "pnpm";
    }
    else if (userAgent.includes("yarn")) {
        return "yarn";
    }
    else if (userAgent.includes("npm")) {
        return "npm";
    }
    else if (userAgent.includes("bun")) {
        return "bun";
    }
    return "unknown";
}
