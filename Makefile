dev:
	docker-compose up -d

dev-down:
	docker-compose down

server:
	denon run --allow-net --allow-read --allow-write --allow-env src/server.ts