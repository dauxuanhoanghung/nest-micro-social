# List commands

```sh Terminal
# Show current processes running
lsof -i :3000,3001,3002,3003 -t

# Kill all processes
kill -9 $(lsof -i :3000,3001,3002,3003 -t)
```

```sh Docker
# Running environment containers
docker composer -f docker/infras.yml up -d

# Running databases
docker composer -f docker/database.dev.yml -d
```

```sh Makefile
# Install packages for sources
make install # On Linux, MacOS
make installwin # On Windows

# Running simultaneously source packages
make start
# or
yarn dev
```
