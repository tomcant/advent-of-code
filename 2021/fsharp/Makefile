DOCKER = docker run --rm -it -v $(PWD):/aoc:rw,delegated -w /aoc mcr.microsoft.com/dotnet/sdk:6.0
SOLVE = $(DOCKER) dotnet fsi --load:Helpers.fsx --load:solutions/$*/Solution.fsx Main.fsx

solve/%/test:
	@$(SOLVE) solutions/$*/test.txt

solve/%:
	@$(SOLVE) solutions/$*/input.txt

.PHONY: format
format:
	@$(DOCKER) bash -c "dotnet tool install -g fantomas-tool >/dev/null && /root/.dotnet/tools/fantomas -r ."

.PHONY: shell
shell:
	@$(DOCKER) bash
