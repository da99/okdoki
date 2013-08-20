
worker_processes  1

if ENV['USER'] == 'root'
  user "deploy_okdoki", "deploy_okdoki"
end
