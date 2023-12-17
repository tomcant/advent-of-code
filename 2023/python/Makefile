IMAGE = python:3.12.1-alpine
DOCKER = docker run --rm -v $(PWD):/app:rw,delegated -w /app

solve/%/test:
	@$(DOCKER) -it $(IMAGE) python solve.py $* test.txt

solve/%:
	@$(DOCKER) -it $(IMAGE) python solve.py $* input.txt

.PHONY: format
format:
	@$(DOCKER) $(IMAGE) sh -c "pip install black && black ."

.PHONY: shell
shell:
	@$(DOCKER) -it $(IMAGE) sh
