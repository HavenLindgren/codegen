# codegen

Code generator.

This is just the placeholder and a very early version (and undocumented version) of a code generator.
Initial version with some documentation to come soon.

# Usage

	codegen users.csv users.sql
	
# Template project

Create a directory (eg. `project1.template`)

Create a template driver file inside (`codegen.template.js`)	
	
	module.exports = function (codegen, users) {
		users.forEach(function (user) {
			codegen.merge({ user: user }, "email.eml", user.name + ".eml");
		});
	}
	
Create a template file (`email.eml`)

	To: <%= user.email %>
	Subject: [codegen] Hi
	
	Hi <%= user.name %>,
	
	this is a test template.

Create a data file (eg. `users.csv`)

	name,email
	John Smith,john.smith@acme.com
	Maria Kenny,maria.kenny@acme.com
	
Invoke the codegenerator

	codegen users.csv project1.template output
	
