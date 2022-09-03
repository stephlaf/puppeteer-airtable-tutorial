require 'open-uri'
require 'nokogiri'

url = 'https://dieuduciel.com/en/categories/bottled-canned/'
# url = 'https://dieuduciel.com/en/categories/bottled-canned/#rosee-dhibiscus'

doc = Nokogiri::HTML(URI.open(url).read)

beers = doc.search('.biere__header-container').map do |element|
  image_url = element.search('.biere__img img').attribute('src').value
  category = element.search('h4.heading').text
  name = element.search('h2.biere__heading').text
  type = element.search('p > strong').text
  alcohol = element.search('p')[1].text
  description = element.search('h4.biere__description').text
  {
    image_url: image_url,
    category: category,
    name: name,
    type: type,
    alcohol: alcohol,
    description: description
  }
end

pp beers
