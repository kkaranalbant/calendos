# Kalendos Shopify App Configuration

This directory contains configuration and documentation for the Kalendos custom Shopify app.

## Prerequisites

- Shopify Partner Account: https://partners.shopify.com/
- Development Store (if testing)

## Setup Instructions

### 1. Create Shopify Partner Account

1. Go to https://partners.shopify.com/
2. Sign up or log in
3. Navigate to "Apps" section

### 2. Create Custom App

1. Click "Create app" → "Create app manually"
2. App name: `Kalendos Mobile App`
3. App URL: `https://your-backend-url.com` (will be updated later)
4. Select your development store

### 3. Configure API Access

#### Storefront API Access Token

1. Go to "API credentials" tab
2. Under "Storefront API", click "Configure"
3. Enable the following permissions:
   - `unauthenticated_read_product_listings` - Read product listings
   - `unauthenticated_write_checkouts` - Create and manage checkouts
   - `unauthenticated_read_customer_tags` - Read customer tags
4. Click "Save"
5. Copy your **Storefront API access token**
6. Add it to `/mobile/.env` as `SHOPIFY_STOREFRONT_ACCESS_TOKEN`

#### Admin API Access Token

1. Go to "API credentials" tab
2. Under "Admin API", click "Configure"
3. Enable the following scopes:
   - `read_orders` - Read orders
   - `write_orders` - Manage orders
   - `read_customers` - Read customers
   - `write_customers` - Manage customers
   - `read_products` - Read products
   - `write_products` - Manage products inventory
4. Click "Save"
5. Copy your **Admin API access token**
6. Add it to `/backend/.env` as `SHOPIFY_ADMIN_API_ACCESS_TOKEN`

### 4. Configure Webhooks

Webhooks will notify your backend when events occur in Shopify.

1. Go to "Webhooks" tab
2. Create the following webhooks (pointing to your backend URL):

**Orders Webhooks:**
- `orders/create` → `https://your-backend-url.com/webhooks/orders/create`
- `orders/updated` → `https://your-backend-url.com/webhooks/orders/updated`
- `orders/fulfilled` → `https://your-backend-url.com/webhooks/orders/fulfilled`
- `orders/cancelled` → `https://your-backend-url.com/webhooks/orders/cancelled`

**Products Webhooks:**
- `products/update` → `https://your-backend-url.com/webhooks/products/update`

3. Copy your **Webhook Secret** (for signature verification)
4. Add it to `/backend/.env` as `SHOPIFY_WEBHOOK_SECRET`

### 5. Test in Development

#### Using Shopify CLI (Optional)

You can use Shopify CLI to test webhooks locally:

\`\`\`bash
npm install -g @shopify/cli
shopify webhook trigger orders/create
\`\`\`

#### Using ngrok for Local Testing

To test webhooks locally:

\`\`\`bash
# Install ngrok
npm install -g ngrok

# Start your backend
cd backend
npm run dev

# In another terminal, expose your backend
ngrok http 3000

# Use the ngrok URL for webhook endpoints
# Example: https://abc123.ngrok.io/webhooks/orders/create
\`\`\`

## API Endpoints

### Storefront API
- **URL**: `https://your-store.myshopify.com/api/2024-01/graphql.json`
- **Authentication**: X-Shopify-Storefront-Access-Token header
- **Documentation**: https://shopify.dev/api/storefront

### Admin API
- **URL**: `https://your-store.myshopify.com/admin/api/2024-01/graphql.json`
- **Authentication**: X-Shopify-Access-Token header
- **Documentation**: https://shopify.dev/api/admin

## Important Notes

### API Rate Limits
- Storefront API: 60 requests per second
- Admin API: 2 requests per second (REST), 1000 points per app per store (GraphQL)

### API Versioning
- Current version used: `2024-01`
- Update API version every 6 months
- Check compatibility: https://shopify.dev/api/usage/versioning

### Security
- **Never commit** API tokens to git
- Use environment variables for all credentials
- Verify webhook signatures on your backend
- Use HTTPS for all webhook endpoints

## Troubleshooting

### "Invalid API credentials"
- Check that your access token is correct in `.env` files
- Ensure API scopes are properly configured
- Verify your store domain is correct

### "Webhook not received"
- Check that webhook URL is publicly accessible (use ngrok for local testing)
- Verify webhook secret matches in backend
- Check Shopify Partner Dashboard → Webhooks for delivery status

### "Rate limit exceeded"
- Implement request throttling in your app
- Cache Shopify API responses when possible
- Use GraphQL instead of REST for better efficiency

## Resources

- [Shopify Partner Dashboard](https://partners.shopify.com/)
- [Shopify API Documentation](https://shopify.dev/api)
- [Storefront API Reference](https://shopify.dev/api/storefront)
- [Admin API Reference](https://shopify.dev/api/admin)
- [Webhook Documentation](https://shopify.dev/api/admin-rest/latest/resources/webhook)
- [API Versioning](https://shopify.dev/api/usage/versioning)

## Next Steps

After completing this setup:

1. ✅ Update `/mobile/.env` with Storefront API credentials
2. ✅ Update `/backend/.env` with Admin API and webhook credentials
3. ✅ Test API connection (Phase 2)
4. ✅ Implement webhook handlers (Phase 5)
5. ✅ Deploy backend and update webhook URLs
