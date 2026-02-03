#!/bin/bash

echo "Stopping and removing containers..."
docker rm -f ahwr-public-user-ui-journey-tests ahwr-backoffice-ui-journey-tests ahwr-application-backend-journey-tests mongodb-journey-tests redis-journey-tests localstack-journey-tests ahwr-ui-tests-wdio-tests-1

if [ $? -eq 0 ]; then
  echo "Containers removed successfully."
else
  echo "Error removing containers."
fi

echo "Removing network ahwr-network-auto..."
docker network rm ahwr-network-auto

if [ $? -eq 0 ]; then
  echo "Network removed successfully."
else
  echo "Error removing network. It may still be in use."
fi
