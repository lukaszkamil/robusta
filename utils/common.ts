import * as crypto from "crypto"
import supertest from "supertest"
import { environmentData } from "./data/index"

const request = supertest.agent(process.env.API_URL)
request.set("User-Agent", "autotests")
request.auth(process.env.BASIC_AUTH_BACKOFFICE_USER, process.env.BASIC_AUTH_BACKOFFICE_PASSWORD)

export async function uploadFakePaymentPhoto(appName: number, documentId: number, language: string, photo: string) {
	return request
		.post("/uploading")
		.set("Content-Type", "multipart/form-data")
		.field("UploadForm[appName]", appName || environmentData.appNames.ppo)
		.field("UploadForm[documentId]", documentId || environmentData.testDocumentWithPrintout.id)
		.field("UploadForm[language]", language || environmentData.testDocumentWithPrintout.language)
		.field("UploadForm[errorRedirectionUrl]", "")
		.field("UploadForm[previousPhotoKey]", "")
		.attach("UploadForm[imageFile]", `${__dirname}/../photos/${photo}`)
		.then((response: any) => {
			const a = response.res.rawHeaders
			const b = a.filter((el: any) => el.includes("validation/result"))
			return b[0].split("/").pop()
		})
}

export async function uploadPhotoAPI(appName: number, documentId: number, language: string, photo: string) {
	return request
		.post("/api/upload?web=1")
		.set("Content-Type", "multipart/form-data")
		.set(
			"User-Agent",
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
		)
		.field("UploadForm[appName]", appName || environmentData.appNames.ppo)
		.field("UploadForm[documentId]", documentId || environmentData.testDocumentWithPrintout.id)
		.field("UploadForm[language]", language || environmentData.testDocumentWithPrintout.language)
		.field("UploadForm[errorRedirectionUrl]", "")
		.field("UploadForm[previousPhotoKey]", "")
		.attach("UploadForm[imageFile]", `${__dirname}/../photos/${photo}`)
		.then((response: any) => {
			const a = JSON.parse(response.res.text).photoKey
			return a
		})
}

export async function reuploadFakePaymentPhoto(
	appName: number,
	documentId: number,
	language: string,
	photo: string,
	previousPhotoKey: string
) {
	return request
		.post("/uploading")
		.set("Content-Type", "multipart/form-data")
		.field("UploadForm[appName]", appName || environmentData.appNames.ppo)
		.field("UploadForm[documentId]", documentId || environmentData.testDocumentWithPrintout.id)
		.field("UploadForm[language]", language || environmentData.testDocumentWithPrintout.language)
		.field("UploadForm[errorRedirectionUrl]", "")
		.field("UploadForm[previousPhotoKey]", previousPhotoKey)
		.attach("UploadForm[imageFile]", `${__dirname}/../photos/${photo}`)
		.then((response: any) => {
			const a = response.res.rawHeaders
			const b = a.filter((el: any) => el.includes("validation/result"))
			return b[0].split("/").pop()
		})
}

async function createFakePaymentSeed(photoKey: string) {
	const hash = crypto.createHash("sha1")
	hash.update(photoKey + "python-probe")
	return hash.digest("hex").substring(0, 20)
}

export async function makeFakePayment(email: string, photoKey: string) {
	const seed = await createFakePaymentSeed(photoKey)

	await request
		.post(`/order/false-create`)
		.query({ photoKey, seed })
		.set("Content-Type", "multipart/form-data")
		.field("Order[or_product_type]", 1)
		.field("Order[or_price]", 0)
		.field("Order[or_cu_id]", 1)
		.field("Order[or_email]", email)
		.field("Agreement[ag_terms_and_privacy]", 0)
		.field("Agreement[ag_terms_and_privacy]", 1)
		.field("Order[or_remarks]", "")
}

export async function makeFakePaymentWithPrintout(email: string, photoKey: string) {
	const seed = await createFakePaymentSeed(photoKey)

	await request
		.post(`/order/false-create`)
		.query({ photoKey, seed })
		.set("Content-Type", "multipart/form-data")
		.field("Order[or_email]", email || "tests@photoaid.com")
		.field("Order[or_price]", 0)
		.field("Order[or_cu_id]", 1)
		.field("Agreement[ag_terms_and_privacy]", 0)
		.field("Agreement[ag_terms_and_privacy]", 1)
		.field("Order[or_remarks]", "")
		.field("Order[or_product_type]", 2) // OPTION_ELECTRONIC_AND_PAPER
		.field("Order[or_zip_code]", "00-000")
		.field("Order[or_client_name]", "John Pink")
		.field("Order[or_country]", "pl")
		.field("Order[or_address]", "Blue Street 1")
		.field("Order[or_city]", "Green City")
}
