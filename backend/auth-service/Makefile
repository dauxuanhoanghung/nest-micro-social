.PHONY: install-latest

install-latest:
	@if [ -z "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		echo "Error: No packages specified. Usage: make install-latest <package1> <package2> ..."; \
		exit 1; \
	fi; \
	yarn add $(filter-out $@,$(MAKECMDGOALS))

# Catch-all target to prevent errors for package names
%:
	@: