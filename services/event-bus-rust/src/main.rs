use async_nats::jetstream::{self, stream::Config};
use serde::Serialize;

#[derive(Serialize)]
struct DomainEvent<'a> {
    event_type: &'a str,
    aggregate_type: &'a str,
    aggregate_id: &'a str,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = async_nats::connect(
        std::env::var("NATS_URL").unwrap_or_else(|_| "nats://127.0.0.1:4222".into()),
    )
    .await?;

    let js = jetstream::new(client);
    let stream = js
        .get_or_create_stream(Config {
            name: "MORTGAGEOPS".to_owned(),
            subjects: vec!["mortgage.>".to_owned()],
            ..Default::default()
        })
        .await?;

    let event = DomainEvent {
        event_type: "application.submitted",
        aggregate_type: "mortgage_application",
        aggregate_id: "demo-application",
    };

    let payload = serde_json::to_vec(&event)?;
    let ack = stream.publish("mortgage.application.submitted", payload.into()).await?;
    ack.await?;

    println!("Published mortgage domain event to NATS JetStream.");
    Ok(())
}
