DOCKER := docker run --rm -it -v $(PWD):/aoc:rw,delegated -w /aoc -e CARGO_HOME=/aoc/.cargo rust:1.54.0-alpine3.14

solve/%:
	@$(DOCKER) cargo run --release --quiet --manifest-path solutions/$*/Cargo.toml

.PHONY: format
format:
	@$(DOCKER) sh -c 'rustup component add rustfmt 2>/dev/null && rustfmt -l solutions/**/src/*.rs'

.PHONY: shell
shell:
	@$(DOCKER) sh
