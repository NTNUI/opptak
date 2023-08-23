#---- COMMANDS ----#

start: ##@Docker (start)
	docker compose up --build

fresh: ##@Docker (start) with fresh fixtures
	docker compose --profile fresh down
	docker compose --profile fresh up --build

clean: ##@Docker (stop) Stops and removes all containers and volumes
	docker compose --profile fresh down -v