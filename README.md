# codegen

Code generator

## Pending

- Copy files and directories using includes and excludes (have a look to Grunt to see how they do it)
- Provide a merge (template + data) with many different options

	codegen.merge(data, template)
	codegen.merge(data, template, output)
	codegen.merge(data, template, [output1, output2])
	codegen.merge(data, [template1, template2])
	codegen.merge(data, {
		"template1": "output1",
		"template2": ["output2", "output3"]
	});

- Provide an option to include comments on a text file for merging content instead of overwriting the full file
