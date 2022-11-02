IMAGE = python:3.11.0-alpine
DOCKER = docker run --rm -v $(PWD):/app:rw,delegated -w /app

solve/%:
	@$(DOCKER) -it $(IMAGE) python solve.py $*

.PHONY: format
format:
	@$(DOCKER) $(IMAGE) sh -c "pip install --upgrade autopep8 && autopep8 --recursive --in-place /app"

.PHONY: shell
shell:
	@$(DOCKER) -it $(IMAGE) sh
