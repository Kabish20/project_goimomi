# Mail and Zoho diagnostic — 21 September 2026

## Confirmed causes

- Production SMTP host is `smtp-relay.brevo.com`. Connections to ports 587 and 465 time out from `172.105.47.106`; port 2525 connects with TLS.
- SMTP authentication on 2525 is rejected with `525 5.7.1 Unauthorized IP address`. Brevo account authorization is required for `172.105.47.106`.
- Root `.env` mail credentials match backend `.env`. CRM credentials differ: root credentials return `invalid_client`; deployed backend credentials return `invalid_code` from the India OAuth endpoint. Neither set was substituted for the other.
- Production has no recorded incoming CRM webhook events. A correctly authenticated request to the Django endpoint returned 200 and created an enquiry inside a rolled-back transaction. No test lead remains.

## Application changes

- Cab and shop OTP endpoints now wait for the configured mail backend to accept the message. They return 503 on failure instead of starting an unobserved thread and claiming success.
- Undelivered codes are removed without deleting a newer concurrent resend code. Codes use a cryptographically secure generator.
- Automated mail tasks route to the running `enquiries` worker queue. Failed order/shipping/delivery/cancellation/voucher mail attempts now trigger the existing bounded retries.
- CRM token requests have a 10-second timeout.
- Tests: 34 backend tests passed using isolated storage and mocked/local-memory delivery. No real customer email was sent during verification.

## Required account actions

1. In Brevo, authorize IP `172.105.47.106` for SMTP. Retain TLS and use port 2525.
2. Reauthorize the Zoho CRM India integration and install the resulting client ID, client secret and refresh token securely in `/var/www/goimomi/goimomibackend/.env`. Do not paste secrets into issue reports.
3. In Zoho CRM, configure the enabled workflow webhook to POST to `https://goimomi.com/api/zoho/crm-webhook/` with header `X-Zoho-Webhook-Secret` matching `ZOHO_CRM_WEBHOOK_SECRET` in the server environment. Send the lead's name, email and phone in the payload. A GET health response alone does not verify workflow delivery.
4. Restart `goimomi` and `goimomi-enquiries` after changing environment values. Check delivery using an explicitly authorized test recipient, and inspect webhook audit records.

Old jobs in other queues have not been replayed. New notification routing does not recover already-failed mail. Provider acceptance does not guarantee inbox placement.

References: [Brevo SMTP ports](https://help.brevo.com/hc/en-us/articles/10905415650322-Which-SMTP-port-should-I-use-Port-587-465-or-2525), [Zoho token errors](https://www.zoho.com/crm/developer/docs/api/v8/access-refresh.html).
