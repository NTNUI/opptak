#---- COMMANDS ----#

start: ##@Docker (start)
	docker compose up --build

fresh: ##@Docker (start) with fresh fixtures
	docker compose --profile fresh down
	docker compose --profile fresh up --build

down: ##@Docker (stop) Stops and removes all containers
	docker compose --profile fresh down