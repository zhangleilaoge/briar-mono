#!/bin/bash
usage = "\
dev                                     同时启动前端服务、后端服务\

dev:
	cd packages/briar-frontend && pnpm run dev & \
	cd packages/briar-node && pnpm run dev & \
	cd packages/briar-shared && pnpm run dev
