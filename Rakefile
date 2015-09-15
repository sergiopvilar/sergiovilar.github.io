require "rubygems"

desc "Deploy to Github Pages"
task :deploy do
  puts "## Deploying to Github Pages"

  puts "## Generating site"
  system "grunt build"

  cd "_site" do
    system "git add -A"

    message = "Site updated at #{Time.now.utc}"
    puts "## Commiting: #{message}"
    system "git commit -m \"#{message}\""

    puts "## Pushing generated site"
    system "git push"

    puts "## Deploy Complete!"
  end
end

name = ENV["name"] || ""

desc "Create a new post"
task :create do

  header = "---\n"
  header += "title: \n"
  header += "date:   "+Time.now.strftime("%Y-%m-%d")+" 19:00:00\n"
  header += "description: \n"
  header += "keywords: \n"
  header += "category: \n"
  header += "header_image: \n"
  header += "---"

  File.write('_posts/' + Time.now.strftime("%Y-%m-%d")+'-'+name+'.md', header)

  puts 'Created: _posts/' + Time.now.strftime("%Y-%m-%d")+'-'+name+'.md';

end
