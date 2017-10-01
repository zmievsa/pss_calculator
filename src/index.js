class AssignmentManager {
	constructor() {
		this.was_assigned = true
	}
	assign(obj, attr, value) {
		if (!obj[attr]) {
			obj[attr] = value;
			this.was_assigned = true
		}
	}
	empty() {
		this.was_assigned = false
	}
}

class Compound {
	// Salt and Sand
	constructor(name, mass, volume, density) {
		this.name = name
		this.mass = getNum(mass);
		this.volume = getNum(volume);
		this.density = getNum(density);
	}
	calcMass() {return this.density * this.volume}
	calcVolume() {return this.mass / this.density}
	calcDensity() {return this.mass / this.volume}
}

class PSS extends Compound {
	// Because of the percentage attribute
	constructor(mass, volume, density, percentage) {
		super("PSS", mass, volume, density);
		this.percentage = getNum(percentage);
	}
}

function getNum(string_num) {
	// Because parseFloat("") evaluates to NaN
	var num = parseFloat(string_num);
	if (isNaN(num)) {
		num = 0;
	}
	return num;
}

function evaluateFields(pss_percentage, salt_m, salt_v, salt_d, sand_m, sand_v, sand_d, pss_m, pss_v, pss_d) {
	// Main interface
	// Calculates values, checks for errors and puts the values in fields
	var pss = new PSS(pss_m.value, pss_v.value, pss_d.value, pss_percentage.value)
	var salt = new Compound("Salt", salt_m.value, salt_v.value, salt_d.value)
	var sand = new Compound("Sand", sand_m.value, sand_v.value, sand_d.value)
	calculateFields(pss, salt, sand)
	checkFields(pss, salt, sand)
	
	pss_percentage.value = pss.percentage
	salt_m.value = salt.mass
	salt_v.value = salt.volume
	salt_d.value = salt.density
	sand_m.value = sand.mass
	sand_v.value = sand.volume
	sand_d.value = sand.density
	pss_m.value = pss.mass
	pss_v.value = pss.volume
	pss_d.value = pss.density
}

function checkFields(pss, salt, sand) {
	// If not all fields have been found
	err = new Error("Not enough information")
	for (compound of [pss, salt, sand]) {
		if (!compound.mass || !compound.volume || !compound.density) {
			throw err
		}
	}
	if (!pss.percentage) {
		throw err
	}
}

function calculateFields(pss, salt, sand) {
	m = new AssignmentManager()
	while (m.was_assigned) {
		m.empty()
		for (item of [pss, salt, sand]) {
			if (item.density && item.volume) {m.assign(item, "mass", item.calcMass())}
			else if (item.mass && item.density) {m.assign(item, "volume", item.calcVolume())}
			else if (item.volume && item.mass) {m.assign(item, "density", item.calcDensity())}
		}
		for (attr of ["mass", "volume"]) {
			// Attributes that are found from equation [salt + sand = PSS]
			if (pss[attr] && salt[attr]) {
				m.assign(sand, attr, pss[attr] - salt[attr])
			}
			if (pss[attr] && sand[attr]) {
				m.assign(salt, attr, pss[attr] - sand[attr])
			}
			if (salt[attr] && sand[attr]) {
				m.assign(pss, attr, sand[attr] + salt[attr])
			}
		}
		if (pss.percentage && salt.density && sand.density) {
			m.assign(pss, "density", 100 / ((pss.percentage / salt.density) + (100-pss.percentage) / sand.density))
		}
		if (pss.mass && salt.mass) {
			m.assign(pss, "percentage", (salt.mass / pss.mass) * 100)
		}
		if (pss.mass && pss.percentage) {
			m.assign(salt, "mass", pss.mass * (pss.percentage / 100))
		}
		if (pss.mass && pss.percentage) {
			m.assign(sand, "mass", pss.mass * ((100 - pss.percentage) / 100))
		}
	}
}

function testCalculateFields() {
	var pss = new PSS("", "", "", "")
	var salt = new Compound("Salt", "", "", "")
	var sand = new Compound("Sand", "", "", "")
	cleanUp(pss, salt, sand)

	pss.percentage = 32
	pss.volume = 62.5
	testCase("pss.percentage and pss.volume", pss, salt, sand)

	pss.percentage = 32
	salt.volume = 20
	testCase("pss.percentage and salt.volume", pss, salt, sand)

	pss.percentage = 32
	sand.volume = 42.5
	testCase("pss.percentage and sand.volume", pss, salt, sand)

	pss.percentage = 32
	pss.mass = 62.5
	testCase("pss.percentage and pss.mass", pss, salt, sand)

	pss.percentage = 32
	salt.mass = 20
	testCase("pss.percentage and salt.mass", pss, salt, sand)

	pss.percentage = 32
	sand.mass = 42.5
	testCase("pss.percentage and sand.mass", pss, salt, sand)

	pss.volume = 62.5
	salt.volume = 20
	testCase("pss.volume and salt.volume", pss, salt, sand)

	pss.volume = 62.5
	sand.volume = 42.5
	testCase("pss.volume and sand.volume", pss, salt, sand)

	pss.volume = 62.5
	salt.mass = 20
	testCase("pss.volume and salt.mass", pss, salt, sand)

	pss.volume = 62.5
	sand.mass = 42.5
	testCase("pss.volume and sand.mass", pss, salt, sand)

	salt.volume = 20
	sand.volume = 42.5
	testCase("salt.volume and sand.volume", pss, salt, sand)

	salt.volume = 20
	pss.mass = 62.5
	testCase("salt.volume and pss.mass", pss, salt, sand)

	salt.volume = 20
	sand.mass = 42.5
	testCase("salt.volume and sand.mass", pss, salt, sand)

	sand.volume = 42.5
	pss.mass = 62.5
	testCase("sand.volume and pss.mass", pss, salt, sand)

	sand.volume = 42.5
	salt.mass = 20
	testCase("sand.volume and salt.mass", pss, salt, sand)

	salt.mass = 20
	sand.mass = 42.5
	testCase("salt.mass and sand.mass", pss, salt, sand)
	window.alert("ALL TESTS RAN")
}
function testCase(test_name, pss, salt, sand) {
	calculateFields(pss, salt, sand)
	checkValues(test_name, pss, salt, sand)
	cleanUp(pss, salt, sand)
}
function cleanUp(pss, salt, sand) {
	pss.percentage =  ""
	pss.mass = ""
	pss.volume = ""
	pss.density = ""
	salt.mass = ""
	salt.volume = ""
	salt.density = 1
	sand.mass = ""
	sand.volume = ""
	sand.density = 1
}
function checkValues(test_name, pss, salt, sand) {
	if (
		parseInt(pss.percentage) !== 32	|| 
		parseInt(pss.mass !== 62.5) 	||
		parseInt(pss.volume !== 62.5)	||
		parseInt(pss.density !== 1)		||
		parseInt(salt.mass !== 20)		||
		parseInt(salt.volume !== 20)	||
		parseInt(salt.density !== 1)	||
		parseInt(sand.mass !== 42.5)	||
		parseInt(sand.volume !== 42.5)	||
		parseInt(sand.density !== 1))
	{
		document.body.innerHTML = ""
		document.write("Pss.percentage " + pss.percentage)
		document.write("<br/>")
		document.write("Pss.mass " + pss.mass)
		document.write("<br/>")
		document.write("Pss.volume " + pss.volume)
		document.write("<br/>")
		document.write("Pss.density " + pss.density)
		document.write("<br/>")
		document.write("Salt.mass " + salt.mass)
		document.write("<br/>")
		document.write("Salt.volume " + salt.volume)
		document.write("<br/>")
		document.write("Salt.density " + salt.density)
		document.write("<br/>")
		document.write("Sand.mass " + sand.mass)
		document.write("<br/>")
		document.write("Sand.volume " + sand.volume)
		document.write("<br/>")
		document.write("Sand.density " + sand.density)
		document.write("<br/>")
		window.alert(test_name + " test case failed")
		throw new Error("FAILED TO RUN TESTS")
	}
}
