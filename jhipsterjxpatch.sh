#!/bin/bash

### sed RangeCommandOptions ie sed -n 1,2 s/orginaltext/newtext/p (here p is print for subsition (s) options), -n, -i are sed options for silent, insert etc
### use below command to edit yaml in sed using ENV variables
#sed -ie "s/bindHost: localhost/bindHost: ${your_variable}/g" /path/to/your/file
#sed -ie "s/bindHost: .*/bindHost: ${your_variable}/g" /path/to/your/file

### sed edit multiline yaml values between two lines
# print only if explicit (-n), between search criteria
#sed -n '/spec: "nameOfKey"/,/anothername:/s/.*anyKeyInBetween: \(.*\)/anyOtherKey: Valuetext/p'


## change webpack profile for testing in prod to ci-cd --> <arguments>run webpack:test-ci</
# not needed
#sed -e "s/npm run lint && npm run jest/npm run lint/" store/package.json

## copy the jh jwt secrets file once for a micro service. same can be used by all
cp ../kubernetes-knative/${PWD##*/}-knative/templates/jwt-secret.yml   charts/${PWD##*/}/templates/jwt-secret.yaml
sed -i  '/namespace: /d' charts/${PWD##*/}/templates/jwt-secret.yaml
sed -i "s/name: jwt-secret/name: jwt-secret-${PWD##*/}/" charts/${PWD##*/}/templates/jwt-secret.yaml
## copy the common gateway and virtualservice files
# also amend details in the file
if [ -f ../kubernetes-knative/${PWD##*/}-knative/templates/${PWD##*/}-gateway.yml ] ; then
cp ../kubernetes-knative/${PWD##*/}-knative/templates/${PWD##*/}-gateway.yml   charts/${PWD##*/}/templates/${PWD##*/}-gateway.yaml
sed -i  '1,/^---$/d'  charts/${PWD##*/}/templates/${PWD##*/}-gateway.yaml
sed -i '/gateways:/,/http:/{/gateways:/!{/http:/!d;};}' charts/${PWD##*/}/templates/${PWD##*/}-gateway.yaml
echo -e '    - knative-serving/cluster-local-gateway\n    - knative-serving/knative-ingress-gateway' | sed -i '/gateways:/r /dev/stdin' charts/${PWD##*/}/templates/${PWD##*/}-gateway.yaml
sed -i '/hosts:/s/    -.*/{{ .Values.service.name }}.{{ .Release.Namespace }}.{{ .Values.jxRequirements.ingress.domain }}/' charts/${PWD##*/}/templates/${PWD##*/}-gateway.yaml
sed -i '/route:/,/\- match:/{/route:/!{/- match:/!d;};}' charts/${PWD##*/}/templates/${PWD##*/}-gateway.yaml
cat > /tmp/HereFile <<HEREDOC
      rewrite:
        authority: {{ .Values.service.name }}.{{ .Release.Namespace }}.{{ .Values.jxRequirements.ingress.domain }}
        uri: /
      route:
        - destination:
            host: istio-ingressgateway.istio-system.svc.cluster.local
            port:
              number: 80
HEREDOC
sed -i '/route:.*/r /tmp/Herefile' charts/${PWD##*/}/templates/${PWD##*/}-gateway.yaml
# below is to replace route:rewrite: lines
sed -i '/      route:$/{$!{N;s/      route:\n      rewrite:/      rewrite:/;ty;P;D;:y}}' charts/${PWD##*/}/templates/${PWD##*/}-gateway.yaml
# delete namespace: metadata row, as it is autopopulated by jx based on environment
sed -i  '/namespace: /d' charts/${PWD##*/}/templates/${PWD##*/}-gateway.yaml
# replace hosts: with dynamic host domain
sed -i "/^  hosts:$/$!N;s/  hosts:\n    - .*/  hosts:\n    - {{ .Values.service.name }}.{{ .Release.Namespace }}.{{ .Values.jxRequirements.ingress.domain }}/" charts/${PWD##*/}/templates/${PWD##*/}-gateway.yaml
#update rewrite authority, with one from prefix
#  sample ----> sed '$!N;s/\(foo\n\)#\(bar\)/\1\2/;P;D' infile
sed -i '/prefix: .*/{$!N};$!N;s/\/services\/\(.*\)\/\n\(.*\)\n        authority: .*}}\.{{ \.Release/\/services\/\1\/\n\2\n        authority: \1\.{{ \.Release/;P;D' charts/${PWD##*/}/templates/${PWD##*/}-gateway.yaml


## below is also working
#sed -i -e  '/route:/{
#    i
#    e cat  /tmp/HereFile ## using exec cat instead of r readFileName
#    }' -e '/^$/d'  charts/${PWD##*/}/templates/${PWD##*/}-gateway.yaml
rm /tmp/HereFile
fi

## copy the requirements.yaml depdendencies from jhipster k8s manifests to jx charts
cp ../kubernetes-knative/${PWD##*/}-knative/requirements.yml  charts/${PWD##*/}/requirements.yaml

## add the values from jhipster to jx charts
if [ -f charts/values.yaml.backup ] ; then
cp charts/values.yaml.backup charts/${PWD##*/}/values.yaml
fi
cp charts/${PWD##*/}/values.yaml charts/values.yaml.backup
cat ../kubernetes-knative/${PWD##*/}-knative/values.yml >> charts/${PWD##*/}/values.yaml


## add the env variables of jhipster to k8s charts
if [ -f charts/ksvc.yaml.backup ] ; then
cp charts/ksvc.yaml.backup charts/${PWD##*/}/templates/ksvc.yaml
fi
cp charts/${PWD##*/}/templates/ksvc.yaml charts/ksvc.yaml.backup
sed -n '/env:/,/resources:/{/env:/!{/resources:/!p;};}' ../kubernetes-knative/${PWD##*/}-knative/templates/${PWD##*/}-service.yml |  sed  's/^    //'   | sed 's/\..*\.svc/\.{{ \.Release\.Namespace }}\.svc/g' | sed -i '/env:/r /dev/stdin' charts/${PWD##*/}/templates/ksvc.yaml
sed -i "s/name: jwt-secret/name: jwt-secret-${PWD##*/}/" charts/${PWD##*/}/templates/ksvc.yaml

### Also to work with knative and istio you need to update the gateway for store for all the services as below
# spec:
#   gateways:
#   - knative-serving/cluster-local-gateway
#   - knative-serving/knative-ingress-gateway
#   hosts:
#   - store.jhipster.cluster12.tagscloud.org
#   http:
#   - match:
#     - uri:
#         prefix: /services/invoice/
#     rewrite:
#       authority: invoice.jhipster.cluster12.tagscloud.org
#       uri: /
#     route:
#     - destination:
#         host: istio-ingressgateway.istio-system.svc.cluster.local
#         port:
#           number: 80


## update the jenkins-x.yaml with custom overrides
if [ -f jenkins-x.yml.backup ] ; then
cp jenkins-x.yml.backup jenkins-x.yml
fi
cp jenkins-x.yml jenkins-x.yml.backup
echo -e "pipelineConfig:
  pipelines:
    overrides:
      - name: gradle-build
        type: replace
        #pipeline: release # as both for release and pullrequest pipeleines
        stage: build
        steps:
          - name: chmod
            image: jhipster/jhipster:v6.9.0
            command: echo jhipster | sudo -S chmod +777 ./
          - name: chmod gradlew
            image: jhipster/jhipster:v6.9.0
            command: echo jhipster | sudo -S chmod +x gradlew
          # - name: clean-webpack
          #   image: jhipster/jhipster:v6.9.0
          #   command: ./gradlew -ntp clean -P-webpack
          # - name: install-tools
          #   image: jhipster/jhipster:v6.9.0
          #   command: ./gradlew -ntp com.github.eirslett:frontend-maven-plugin:install-node-and-npm -DnodeVersion=v12.16.1 -DnpmVersion=6.14.5
          # - name: install-npm
          #   image: jhipster/jhipster:v6.9.0
          #   command: ./gradlew -ntp com.github.eirslett:frontend-maven-plugin:npm
          - name: package
            image: jhipster/jhipster:v6.9.0
            #command: ./mvnw -ntp verify -P-webpack -Pprod -DskipTests
            # for testing below
            command: ./gradlew bootJar -x test -Pprod -PnodeInstall --no-daemon
            env:
              - name: _JAVA_OPTIONS
                value: -XX:+UnlockExperimentalVMOptions
                  -Dsun.zip.disableMemoryMapping=true -XX:+UseParallelGC -XX:MinHeapFreeRatio=5
                  -XX:MaxHeapFreeRatio=10 -XX:GCTimeRatio=4 -XX:AdaptiveSizePolicyWeight=90
                  -Xms100m -Xmx800m
" >> jenkins-x.yml
