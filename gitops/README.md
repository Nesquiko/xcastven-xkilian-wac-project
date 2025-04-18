## GitOps

### Local cluster

```bash
kubectl apply -k infrastructure/fluxcd

kubectl create namespace wac-hospital

kubectl apply -k clusters/localhost/secrets

kubectl apply -k clusters/localhost
```

Then check with:

```bash
kubectl get gitrepository -n wac-hospital

kubectl get kustomization -n wac-hospital
```

Port forward the app:

```bash
kubectl --namespace polyfea port-forward svc/polyfea-controller 30331:80
```
