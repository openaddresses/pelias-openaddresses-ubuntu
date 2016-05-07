all:

pelias-openaddresses:
	mkdir pelias-openaddresses
	curl -sL https://github.com/pelias/openaddresses/archive/eccb6e1e8.tar.gz | tar -C pelias-openaddresses --strip-components=1 -xzvf -

pelias-openaddresses/node_modules: pelias-openaddresses
	cd pelias-openaddresses && npm install

install:
	find pelias-openaddresses -type f -exec install -v -D -m0755 '{}' '$(DESTDIR)/usr/lib/nodejs/{}' \;
