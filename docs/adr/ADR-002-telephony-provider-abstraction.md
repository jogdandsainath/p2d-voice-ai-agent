# ADR-002: Telephony Provider Abstraction

## Status
Accepted

## Context
Telephony carrier requirements vary significantly by country. In the US/EU, Twilio provides straightforward programmable voice; however, in India, Department of Telecommunications (DoT) and TRAI regulations restrict toll bypass and require OSP routing / DLT registration, often necessitating Indian TSPs (Tata, Airtel, Jio) or platforms like Exotel/Knowlarity. Binding directly to Twilio would prevent Indian enterprise adoption.

## Decision
Create a strict `TelephonyProvider` port/interface. All call operations (inbound parsing, outbound dialing, media streaming, recording callbacks, transfers) are defined in `@p2d/telephony`. Adapters for Twilio (`TwilioTelephonyAdapter`), India SIP/Exotel (`IndiaSipTelephonyAdapter`), and local testing (`MockTelephonyAdapter`) implement this interface.

## Consequences
- **Pros:** Seamless provider swapping per phone number or region without altering the core conversation engine.
- **Cons:** Must maintain a normalized event model across disparate provider webhook payloads.
