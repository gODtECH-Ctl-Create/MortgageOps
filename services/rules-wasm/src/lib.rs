use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Debug, Deserialize)]
struct UnderwritingInput {
    monthly_income: f64,
    monthly_obligations: f64,
    property_value: f64,
    requested_amount: f64,
}

#[derive(Debug, Serialize)]
struct UnderwritingResult {
    debt_service_ratio: f64,
    loan_to_value: f64,
    eligible: bool,
    reasons: Vec<String>,
}

#[wasm_bindgen]
pub fn evaluate_underwriting(input: JsValue) -> Result<JsValue, JsValue> {
    let input: UnderwritingInput = serde_wasm_bindgen::from_value(input)
        .map_err(|error| JsValue::from_str(&error.to_string()))?;

    if input.monthly_income <= 0.0 || input.property_value <= 0.0 || input.requested_amount <= 0.0 {
        return Err(JsValue::from_str("Income, property value and requested amount must be positive"));
    }

    let debt_service_ratio = input.monthly_obligations / input.monthly_income;
    let loan_to_value = input.requested_amount / input.property_value;

    let mut reasons = Vec::new();
    if debt_service_ratio > 0.50 {
        reasons.push("Debt service ratio is above the prototype policy threshold.".to_owned());
    }
    if loan_to_value > 0.80 {
        reasons.push("Loan-to-value is above the prototype policy threshold.".to_owned());
    }

    let result = UnderwritingResult {
        debt_service_ratio,
        loan_to_value,
        eligible: reasons.is_empty(),
        reasons,
    };

    serde_wasm_bindgen::to_value(&result).map_err(|error| JsValue::from_str(&error.to_string()))
}
