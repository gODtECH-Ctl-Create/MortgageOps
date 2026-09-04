defmodule MortgageOpsRealtime.CaseEvents do
  alias Phoenix.PubSub

  @pubsub MortgageOpsRealtime.PubSub

  def subscribe(case_id) when is_binary(case_id) do
    PubSub.subscribe(@pubsub, "case:" <> case_id)
  end

  def broadcast(case_id, event) when is_binary(case_id) and is_map(event) do
    PubSub.broadcast(@pubsub, "case:" <> case_id, {:mortgage_case_event, event})
  end
end
