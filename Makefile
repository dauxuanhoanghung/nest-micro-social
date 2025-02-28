# Define service directories
SERVICES = api-gateway auth-service post-service user-service

# Default to using Yarn, but you can switch to npm if needed
install:
	@for service in $(SERVICES); do \
		echo "Installing dependencies for $$service..."; \
		cd backend/$$service && yarn install --frozen-lockfile && cd -; \
	done

installwin:
	@for %%s in ($(SERVICES)) do ( \
		if exist backend\%%s ( \
			echo Installing dependencies for %%s... && \
			pushd backend\%%s && yarn install --frozen-lockfile && popd \
		) else ( \
			echo Directory backend\%%s does not exist! \
		) \
	)

start:
	@for service in $(SERVICES); do \
		echo "Starting $$service..."; \
		cd backend/$$service && yarn start:dev & \
		cd -; \
	done
	@wait

stop:
	@echo "Stopping all services..."
	@pkill -f "node" || true

restart: stop install start

.PHONY: install start stop restart
