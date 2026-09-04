defmodule MortgageOpsRealtime.Application do
  use Application

  @impl true
  def start(_type, _args) do
    children = [
      {Phoenix.PubSub, name: MortgageOpsRealtime.PubSub}
    ]

    Supervisor.start_link(children, strategy: :one_for_one, name: MortgageOpsRealtime.Supervisor)
  end
end
