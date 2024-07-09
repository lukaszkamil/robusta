import test from "./test"
import stage from "./stage"
import prod from "./prod"

const environments = {
	test,
	stage,
	prod
}

const environmentData = environments[process.env.TEST_ENVIRONMENT]

export { environmentData }
