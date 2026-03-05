---
sidebar_position: 3
custom_edit_url: null
---

# 🚀 Deployment Guide

This guide provides instructions for deploying **SPACE** in a production environment. It includes all the required dependencies, steps and best practices to ensure a successful deployment.

:::info
All examples in this guide assume that **SPACE** is deployed on a machine running **Rocky Linux 9**. However, the instructions can be easily adapted to other Linux distributions with minimal changes.
:::

## 🧩 Required Software


| Dependency | Minimum Version | Purpose | Installation |
|------------|-----------------|---------|--------------|
| 🐳 **Docker** | ≥ 29.1.0 | Used to build and run the SPACE containers. | Follow the installation instructions for **Windows, macOS, and Linux** available [here](https://medium.com/@piyushkashyap045/comprehensive-guide-installing-docker-and-docker-compose-on-windows-linux-and-macos-a022cf82ac0b). |
| 📦 **Docker Compose** | ≥ 5.0.0 | Used to define and manage the multi-container services required by SPACE. | Docker Compose is typically included with modern Docker installations. If it is not available in your system, follow the instructions in the guide above to install it. |
| 🐙 **Git** | ≥ 2.30.0 | Required to clone the SPACE repository and manage the project source code from the command line. | Installation instructions for **Linux, macOS, and Windows** are available in the official documentation: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git |

## 1. Clone the repository on your machine