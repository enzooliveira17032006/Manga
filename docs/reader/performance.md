# Performance

As estratégias aplicadas evitam que uma promessa gigante com `.map()` exploda a RAM do Celular/PC do usuário ao abrir um mangá de 200 páginas:

## IntersectionObserver e LazyLoading
A variável de estado da imagem começa com "pending" e não gera tráfego de rede.
Assim que ela cruza a linha de renderização em background, é promovida a "loading".

## Preload
Foi criado o gatilho `isPreloadTarget = index < currentPage + 3`.
Apenas a página atual e as próximas 3 páginas entram na linha de requisição da rede. As outras esperam.

## Skeleton Loading da Inicialização
Enquanto a API (`ApiClient`) busca os arrays do backend e calcula O Próximo / O Anterior (para resolver navegação lateral), exibimos um *Loading Skeleton* de pulsação, bloqueando travamentos no Runtime do Next.
