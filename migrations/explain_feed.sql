EXPLAIN     
SELECT * 
FROM posts 
WHERE pub_id IN (SELECT pub_id FROM follows WHERE screen_name_id IN (SELECT id FROM screen_names WHERE customer_id = 'DDCcBshDT0t' ) )
ORDER BY created_at DESC
 ;