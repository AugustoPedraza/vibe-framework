# Deployment Checklist

> Run through before deploying to production.

## Pre-Deployment

### Code Quality

- [ ] All tests passing
- [ ] `just check` passes locally
- [ ] CI/CD pipeline green
- [ ] No compiler warnings
- [ ] No `TODO` or `FIXME` in critical paths

### Configuration

- [ ] Environment variables set in production
- [ ] Database migrations reviewed
- [ ] Secrets rotated if needed
- [ ] SSL certificates valid

### Database

- [ ] Migrations are reversible
- [ ] No destructive migrations without backup plan
- [ ] Indexes added for new queries
- [ ] Connection pool sized appropriately

---

## Deployment Steps

### Database First

- [ ] Backup production database
- [ ] Run migrations in staging first
- [ ] Run migrations in production
- [ ] Verify migrations succeeded

### Application

- [ ] Deploy application
- [ ] Monitor startup logs
- [ ] Check health endpoint
- [ ] Verify basic functionality

---

## Post-Deployment

### Verification

- [ ] Homepage loads
- [ ] Login/logout works
- [ ] Critical user flows work
- [ ] API responses correct
- [ ] Real-time features work (PubSub)

### Monitoring

- [ ] Error rates normal
- [ ] Response times acceptable
- [ ] Memory usage stable
- [ ] No unusual log patterns

### Rollback Ready

- [ ] Previous version tagged
- [ ] Rollback procedure documented
- [ ] Database can rollback if needed

---

## PWA Specific

- [ ] Service worker updated
- [ ] Cache invalidation working
- [ ] Offline fallback works
- [ ] Install prompt appears correctly
- [ ] Push notifications work (if applicable)

---

## Communication

- [ ] Team notified of deployment
- [ ] Status page updated if needed
- [ ] Customer support aware of changes

---

## Rollback Triggers

Rollback immediately if:

- [ ] Error rate > 5%
- [ ] Response time 2x normal
- [ ] Critical feature broken
- [ ] Data integrity issues

---

## Post-Mortem (if issues)

- [ ] Document what went wrong
- [ ] Identify root cause
- [ ] Create action items
- [ ] Update runbooks
