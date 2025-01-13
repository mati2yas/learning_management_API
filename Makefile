# Variables
PHP_ARTISAN = php artisan
NPM = npm
PORT = 8000

# Default target
.PHONY: all
all: serve dev

# Start Laravel server
.PHONY: serve
serve:
	@echo "Starting Laravel server..."
	$(PHP_ARTISAN) serve --host=127.0.0.1 --port=$(PORT)

# Run frontend development server
.PHONY: dev
dev:
	@echo "Starting frontend development server..."
	$(NPM) run dev

# Stop all running servers
.PHONY: stop
stop:
	@echo "Stopping all running servers..."
	@pkill -f "php artisan serve" || echo "No Laravel server running"
	@pkill -f "vite" || echo "No Vite server running"

# Clean up cached files
.PHONY: clean
clean:
	@echo "Clearing Laravel caches..."
	$(PHP_ARTISAN) cache:clear
	$(PHP_ARTISAN) config:clear
	$(PHP_ARTISAN) route:clear
	$(PHP_ARTISAN) view:clear
	@echo "Cleared all caches!"
