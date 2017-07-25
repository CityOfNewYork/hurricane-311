pre_post=$1
order=$2

if [ "$pre_post" = "pre-keys" ]
  then
    cp pre-storm-content-keys.csv ../src/main/webapp/data/content.csv
fi

if [ "$pre_post" = "post-keys" ]
  then
    cp post-storm-content-keys.csv ../src/main/webapp/data/content.csv
fi
 
if [ "$pre_post" = "pre" ]
  then
    cp pre-storm-content.csv ../src/main/webapp/data/content.csv
fi

if [ "$pre_post" = "post" ]
  then
    cp post-storm-content.csv ../src/main/webapp/data/content.csv
fi
 
if [ "$order" = "yes" ]
  then
  	cp yes-order.csv ../src/main/webapp/data/order.csv
fi

if [ "$order" = "no" ]
  then
  	cp no-order.csv ../src/main/webapp/data/order.csv
fi