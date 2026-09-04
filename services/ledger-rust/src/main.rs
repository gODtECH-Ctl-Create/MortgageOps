use axum::{routing::post, Json, Router};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use std::{net::SocketAddr, str::FromStr};
use thiserror::Error;

#[derive(Debug, Error)]
enum LedgerError {
    #[error("amount must be positive")]
    NonPositive,
    #[error("debit and credit accounts must differ")]
    SameAccount,
    #[error("invalid decimal amount")]
    InvalidAmount,
}

#[derive(Debug, Deserialize)]
struct PostEntryRequest {
    debit_account: String,
    credit_account: String,
    amount: String,
    currency: String,
    reference: Option<String>,
}

#[derive(Debug, Serialize)]
struct PostEntryResponse {
    accepted: bool,
    reference: Option<String>,
    amount: String,
    currency: String,
}

fn validate_entry(request: &PostEntryRequest) -> Result<Decimal, LedgerError> {
    let amount = Decimal::from_str(&request.amount).map_err(|_| LedgerError::InvalidAmount)?;
    if amount <= Decimal::ZERO {
        return Err(LedgerError::NonPositive);
    }
    if request.debit_account == request.credit_account {
        return Err(LedgerError::SameAccount);
    }
    Ok(amount)
}

async fn post_entry(Json(request): Json<PostEntryRequest>) -> Result<Json<PostEntryResponse>, String> {
    let amount = validate_entry(&request).map_err(|error| error.to_string())?;

    // Persistence and database transaction are intentionally the next layer.
    // This service boundary makes money validation explicit before a posting occurs.
    Ok(Json(PostEntryResponse {
        accepted: true,
        reference: request.reference,
        amount: amount.to_string(),
        currency: request.currency,
    }))
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/v1/ledger/entries", post(post_entry));
    let address = SocketAddr::from(([0, 0, 0, 0], 4100));

    let listener = tokio::net::TcpListener::bind(address).await.expect("bind ledger service");
    println!("MortgageOps Rust ledger listening on {address}");
    axum::serve(listener, app).await.expect("ledger server failed");
}
