# Define service directories
SERVICES = api-gateway auth-service post-service user-service

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
	@echo "Setting up concurrently..."
	@yarn
	@echo "Starting all services using concurrently..."
	@npx concurrently \
		"cd backend/api-gateway && yarn start:dev" \
		"cd backend/auth-service && yarn start:dev" \
		"cd backend/post-service && yarn start:dev" \
		"cd backend/user-service && yarn start:dev" \
		--names "API-GATEWAY,AUTH,POST,USER" \
		--prefix-colors "blue,green,yellow,magenta" \
		--kill-others

.PHONY: install installwin start
