\c biztime

DROP TABLE IF EXISTS companies_industries;
DROP TABLE IF EXISTS industries;

-- Create industries table
CREATE TABLE industries (
    code text PRIMARY KEY,
    industry text NOT NULL UNIQUE
);

-- Create a join table for companies and industries
CREATE TABLE companies_industries ( 
    comp_code text REFERENCES companies ON DELETE CASCADE,
    ind_code text REFERENCES industries ON DELETE CASCADE,
    PRIMARY KEY (comp_code, ind_code)
);

-- Insert sample data into industries table
INSERT INTO industries (code, industry) 
VALUES ('acct', 'Accounting'),
       ('tech', 'Technology'),
       ('fin', 'Finance');

-- Associate industries with companies
INSERT INTO companies_industries (comp_code, ind_code) 
VALUES ('apple', 'tech'),
       ('ibm', 'tech'),
       ('ibm', 'fin');
