# Beagvs WordPress Theme Conversion Guide

This document outlines how to convert the Beagvs React/Next.js application into a WordPress theme.

## Theme Structure

```
beagvs-theme/
├── index.php              # Homepage template
├── header.php             # Global header/navigation
├── footer.php             # Global footer
├── style.css              # Theme stylesheet
├── functions.php          # Theme functions
├── templates/
│   ├── page-marketplace.php
│   ├── page-about.php
│   ├── page-shipping.php
│   ├── page-contact.php
│   ├── page-news.php
│   ├── single-listing.php
│   ├── single-news.php
│   ├── page-dashboard.php
│   ├── page-admin.php
│   └── page-checkout.php
├── inc/
│   ├── custom-post-types.php
│   ├── taxonomies.php
│   ├── pi-network-integration.php
│   └── escrow-system.php
└── assets/
    ├── css/
    ├── js/
    └── images/
```

## Custom Post Types

### 1. Listings
```php
// Register custom post type for marketplace listings
register_post_type('listing', [
    'labels' => [
        'name' => 'Listings',
        'singular_name' => 'Listing'
    ],
    'public' => true,
    'has_archive' => true,
    'supports' => ['title', 'editor', 'thumbnail', 'custom-fields'],
    'rewrite' => ['slug' => 'marketplace'],
]);
```

### 2. Orders
```php
register_post_type('order', [
    'labels' => [
        'name' => 'Orders',
        'singular_name' => 'Order'
    ],
    'public' => false,
    'show_ui' => true,
    'capability_type' => 'post',
    'supports' => ['title', 'custom-fields'],
]);
```

### 3. News Articles
```php
// Use default 'post' type or create custom
register_post_type('news', [
    'labels' => [
        'name' => 'News',
        'singular_name' => 'News Article'
    ],
    'public' => true,
    'has_archive' => true,
    'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
    'rewrite' => ['slug' => 'news'],
]);
```

## Custom Fields (ACF/Meta Boxes)

### Listing Fields
- `listing_price_pi` - Price in Pi tokens
- `listing_type` - goods/services
- `listing_category` - Category taxonomy
- `listing_status` - active/sold/inactive
- `listing_seller_id` - User ID
- `listing_is_featured` - Boolean
- `listing_delivery_methods` - Array of delivery options
- `listing_images` - Gallery field

### Order Fields
- `order_buyer_id` - User ID
- `order_seller_id` - User ID
- `order_listing_id` - Listing post ID
- `order_total_pi` - Total price
- `order_delivery_method` - Selected delivery method
- `order_shipping_address` - Text
- `order_tracking_number` - Text
- `order_escrow_id` - Escrow transaction ID
- `order_status` - pending/processing/completed/cancelled

### Escrow Fields
- `escrow_order_id` - Order post ID
- `escrow_amount_pi` - Amount held
- `escrow_status` - pending/held/released/disputed
- `escrow_pi_transaction_id` - Pi Network transaction ID
- `escrow_released_date` - Date

## Custom Taxonomies

```php
// Listing Categories
register_taxonomy('listing_category', 'listing', [
    'labels' => ['name' => 'Categories'],
    'hierarchical' => true,
    'show_admin_column' => true,
]);

// Delivery Methods
register_taxonomy('delivery_method', 'listing', [
    'labels' => ['name' => 'Delivery Methods'],
    'hierarchical' => false,
]);
```

## User Roles

### Custom Roles
1. **Buyer** - Can browse and purchase listings
2. **Seller** - Can create and manage listings
3. **Admin** - Full platform management

```php
add_role('buyer', 'Buyer', [
    'read' => true,
    'edit_posts' => false,
]);

add_role('seller', 'Seller', [
    'read' => true,
    'edit_posts' => true,
    'publish_posts' => true,
    'upload_files' => true,
]);
```

## Pi Network Integration

### PHP SDK Integration
```php
// functions.php
require_once get_template_directory() . '/inc/pi-network-integration.php';

class BeagvsPiNetwork {
    private $api_key;
    private $platform_wallet;
    
    public function __construct() {
        $this->api_key = get_option('beagvs_pi_api_key');
        $this->platform_wallet = get_option('beagvs_pi_wallet');
    }
    
    public function create_payment($amount, $memo) {
        // Pi Network API call
    }
    
    public function create_escrow($order_id, $amount) {
        // Create escrow transaction
    }
    
    public function release_escrow($escrow_id) {
        // Release funds to seller
    }
}
```

## Template Mapping

### React Component → WordPress Template

| React Route | WordPress Template |
|------------|-------------------|
| `/` | `index.php` or `front-page.php` |
| `/marketplace` | `page-marketplace.php` or `archive-listing.php` |
| `/marketplace/[id]` | `single-listing.php` |
| `/about` | `page-about.php` |
| `/shipping` | `page-shipping.php` |
| `/news` | `archive-news.php` |
| `/news/[slug]` | `single-news.php` |
| `/contact` | `page-contact.php` |
| `/cart` | `page-cart.php` |
| `/checkout` | `page-checkout.php` |
| `/dashboard` | `page-dashboard.php` |
| `/admin` | `page-admin.php` |
| `/privacy` | `page-privacy.php` |
| `/terms` | `page-terms.php` |
| `/disclaimer` | `page-disclaimer.php` |

## Admin Settings Page

```php
// Add admin menu
add_action('admin_menu', function() {
    add_menu_page(
        'Beagvs Settings',
        'Beagvs',
        'manage_options',
        'beagvs-settings',
        'beagvs_settings_page',
        'dashicons-store'
    );
});

function beagvs_settings_page() {
    // Settings fields:
    // - Pi Network API Key
    // - Platform Wallet Address
    // - Escrow Wallet Address
    // - Platform Fee Percentage
    // - Featured Listing Price
}
```

## Database Tables

While WordPress uses post meta, consider custom tables for:

### Escrow Transactions
```sql
CREATE TABLE wp_beagvs_escrow (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    amount_pi DECIMAL(18,8) NOT NULL,
    status VARCHAR(20) NOT NULL,
    pi_transaction_id VARCHAR(255),
    created_at DATETIME,
    released_at DATETIME,
    FOREIGN KEY (order_id) REFERENCES wp_posts(ID)
);
```

### Disputes
```sql
CREATE TABLE wp_beagvs_disputes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    initiator_id BIGINT NOT NULL,
    reason TEXT,
    status VARCHAR(20),
    resolution TEXT,
    created_at DATETIME,
    resolved_at DATETIME,
    FOREIGN KEY (order_id) REFERENCES wp_posts(ID)
);
```

## REST API Endpoints

```php
// Register custom REST endpoints
add_action('rest_api_init', function() {
    register_rest_route('beagvs/v1', '/listings', [
        'methods' => 'GET',
        'callback' => 'beagvs_get_listings',
    ]);
    
    register_rest_route('beagvs/v1', '/checkout', [
        'methods' => 'POST',
        'callback' => 'beagvs_process_checkout',
        'permission_callback' => function() {
            return is_user_logged_in();
        }
    ]);
});
```

## Styling

Convert Tailwind CSS to WordPress-compatible CSS:
1. Use Tailwind's build process to generate CSS
2. Enqueue in `functions.php`:

```php
function beagvs_enqueue_styles() {
    wp_enqueue_style('beagvs-tailwind', get_template_directory_uri() . '/assets/css/tailwind.css');
    wp_enqueue_script('beagvs-main', get_template_directory_uri() . '/assets/js/main.js', ['jquery'], '1.0', true);
}
add_action('wp_enqueue_scripts', 'beagvs_enqueue_styles');
```

## Authentication

Replace Pi Network OAuth with WordPress login + custom Pi wallet field:

```php
// Add Pi wallet field to user profile
add_action('show_user_profile', 'beagvs_user_pi_wallet_field');
add_action('edit_user_profile', 'beagvs_user_pi_wallet_field');

function beagvs_user_pi_wallet_field($user) {
    ?>
    <h3>Pi Network</h3>
    <table class="form-table">
        <tr>
            <th><label for="pi_wallet_address">Pi Wallet Address</label></th>
            <td>
                <input type="text" name="pi_wallet_address" id="pi_wallet_address" 
                       value="<?php echo esc_attr(get_user_meta($user->ID, 'pi_wallet_address', true)); ?>" 
                       class="regular-text" />
            </td>
        </tr>
    </table>
    <?php
}
```

## Security Considerations

1. **Nonce verification** for all form submissions
2. **Capability checks** for admin/seller actions
3. **Sanitize** all user inputs
4. **Escape** all outputs
5. **Prepared statements** for database queries

## Plugins Required

1. **Advanced Custom Fields Pro** - For custom fields
2. **WooCommerce** (optional) - Can extend for e-commerce features
3. **Custom Post Type UI** - For easy post type management
4. **Contact Form 7** - For contact page
5. **Yoast SEO** - For SEO optimization

## Migration Steps

1. Install fresh WordPress
2. Create theme structure
3. Register custom post types and taxonomies
4. Create ACF field groups
5. Import/migrate data from React app
6. Set up Pi Network integration
7. Configure payment gateways
8. Test all functionality
9. Deploy to production

## Maintenance

- Keep Pi Network SDK updated
- Regular security audits
- Database optimization
- Backup escrow transaction data
- Monitor transaction logs
