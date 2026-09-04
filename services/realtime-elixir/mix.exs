defmodule MortgageOpsRealtime.MixProject do
  use Mix.Project

  def project do
    [
      app: :mortgageops_realtime,
      version: "0.1.0",
      elixir: "~> 1.18",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  def application do
    [extra_applications: [:logger], mod: {MortgageOpsRealtime.Application, []}]
  end

  defp deps do
    [
      {:phoenix, "~> 1.8.13"},
      {:phoenix_pubsub, "~> 2.3"}
    ]
  end
end
