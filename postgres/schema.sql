-- Create Enums --

CREATE TYPE selector AS ENUM('checkbox', 'radio', 'number', 'size');
CREATE TYPE order_status AS ENUM ('active', 'complete', 'abandoned');

-- Create Functions

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create tables --

CREATE TABLE dev.account (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name name NOT NULL,
    email text,
    phone text,
    token text,

    firebase_id text,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT user_pkey PRIMARY KEY (id)
);

CREATE INDEX firebase_id_index ON account USING btree
(
	firebase_id
);

ALTER TABLE dev.account OWNER TO dev;

CREATE TABLE dev.restaurant (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name name NOT NULL,
    location json,
    type text NOT NULL,
    email text NOT NULL,
    phone text,
    logo text,
    colors json,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT restaurant_pkey PRIMARY KEY (id)
);

ALTER TABLE dev.restaurant OWNER TO dev;

CREATE TABLE dev.menu_category (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name name NOT NULL,
    restaurant_id uuid NOT NULL,
    image_url text,
    colors json,
    position integer NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT menu_category_pkey PRIMARY KEY (id),
    
    CONSTRAINT restaurant_fkey
        FOREIGN KEY(restaurant_id) 
        REFERENCES restaurant(id)
);

ALTER TABLE dev.menu_category OWNER TO dev;

CREATE TABLE dev.menu_item (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name name NOT NULL,
    description text,
    menu_category_id uuid NOT NULL,
    price numeric NOT NULL,
    calories integer,
    stock integer,
    image_url text,
    colors json,
    position integer NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT menu_item_pkey PRIMARY KEY (id),
    CONSTRAINT menu_category_fkey
        FOREIGN KEY(menu_category_id) 
        REFERENCES menu_category(id)
);

ALTER TABLE dev.menu_item OWNER TO dev;

CREATE TABLE dev.menu_item_option_category (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name name NOT NULL,
    description text,
    menu_item_id uuid NOT NULL,
    min_options integer NOT NULL, 
    max_options integer NOT NULL, 
    position integer NOT NULL,
    selector_type selector NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT menu_item_option_category_pkey PRIMARY KEY (id),
    CONSTRAINT menu_item_fkey
        FOREIGN KEY(menu_item_id) 
        REFERENCES menu_item(id)
);

ALTER TABLE dev.menu_item_option_category OWNER TO dev;

CREATE TABLE dev.menu_item_option (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name name NOT NULL,
    description text,
    menu_item_option_category_id uuid NOT NULL,
    price_delta numeric NOT NULL,
    calories_delta integer,
    position integer NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT menu_item_option_pkey PRIMARY KEY (id),
    
    CONSTRAINT menu_item_option_category_fkey
        FOREIGN KEY(menu_item_option_category_id) 
        REFERENCES menu_item_option_category(id)
);

ALTER TABLE dev.menu_item_option OWNER TO dev;

CREATE TABLE dev.order (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    account_id uuid NOT NULL,
    restaurant_id uuid NOT NULL,
    tip numeric NOT NULL,
    status order_status NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT order_pkey PRIMARY KEY (id),

    CONSTRAINT user_fkey
        FOREIGN KEY(account_id) 
        REFERENCES dev.account(id),

    CONSTRAINT restaurant_fkey
        FOREIGN KEY(restaurant_id) 
        REFERENCES restaurant(id)
);

ALTER TABLE dev.order OWNER TO dev;

CREATE TABLE dev.order_item (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    price numeric NOT NULL,
    order_id uuid NOT NULL,
    menu_item_id uuid NOT NULL,
    item_number integer NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT order_item_pkey PRIMARY KEY (id),
    
    CONSTRAINT order_fkey
        FOREIGN KEY(order_id) 
	    REFERENCES dev.order(id),
    
    CONSTRAINT menu_item_fkey
        FOREIGN KEY(menu_item_id) 
        REFERENCES menu_item(id)
);

ALTER TABLE dev.order_item OWNER TO dev;

CREATE TABLE dev.order_item_option (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_item_id uuid NOT NULL,
    menu_item_option_id uuid NOT NULL,
    value integer NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT order_item_option_pkey PRIMARY KEY (id),
    
    CONSTRAINT order_item_fkey
        FOREIGN KEY(order_item_id) 
	    REFERENCES dev.order_item(id)
        ON DELETE CASCADE,
    
    CONSTRAINT menu_item_option_fkey
        FOREIGN KEY(menu_item_option_id) 
        REFERENCES menu_item_option(id)
);

ALTER TABLE dev.order_item_option OWNER TO dev;



-- Create Triggers to auto set updated_at
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON dev.user
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON dev.restaurant
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON dev.menu_category
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON dev.menu_item
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON dev.menu_item_option_category
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON dev.menu_item_option
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON dev.order
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON dev.order_item
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON dev.order_item_option
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();









