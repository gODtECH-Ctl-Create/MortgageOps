package mortgageops.underwriting

default eligible := false

eligible if {
    input.monthly_income > 0
    input.property_value > 0
    input.requested_amount > 0
    debt_service_ratio <= 0.50
    loan_to_value <= 0.80
}

debt_service_ratio := input.monthly_obligations / input.monthly_income
loan_to_value := input.requested_amount / input.property_value

reason contains "Debt service ratio is above the prototype policy threshold." if {
    debt_service_ratio > 0.50
}

reason contains "Loan-to-value is above the prototype policy threshold." if {
    loan_to_value > 0.80
}
